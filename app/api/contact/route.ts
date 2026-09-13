import { NextRequest, NextResponse } from 'next/server';
import { nuevoEventId } from '@/lib/meta/eventos';
import { userDataParaMeta } from '@/lib/meta/hash';
import { resolverFbc } from '@/lib/meta/fbc';
import { FBP_DURACION_S, resolverFbp } from '@/lib/meta/fbp';
import { capiConfigurada, enviarEventoAMeta } from '@/lib/meta/capi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { nombre, telefono, tipoServicio, email, direccion, mensaje, formId, page, website, municipio, franjaHoraria, aceptaTerminos, eventId, externalId, sourceUrl } = body;

    // Honeypot check — si tiene valor, es bot, retornar éxito falso
    if (website) {
      return NextResponse.json({ success: true, message: 'Datos recibidos correctamente' });
    }

    // Validate required fields
    if (!nombre || nombre.length < 2) {
      return NextResponse.json(
        { success: false, error: 'El nombre es requerido (mínimo 2 caracteres)' },
        { status: 400 }
      );
    }

    if (!telefono || telefono.replace(/\D/g, '').length < 7) {
      return NextResponse.json(
        { success: false, error: 'El teléfono es requerido (mínimo 7 dígitos)' },
        { status: 400 }
      );
    }

    if (!tipoServicio) {
      return NextResponse.json(
        { success: false, error: 'Debe seleccionar un tipo de servicio' },
        { status: 400 }
      );
    }

    const payload = {
      nombre,
      telefono,
      email: email || null,
      tipoServicio,
      direccion: direccion || null,
      mensaje: mensaje || null,
      // Campos de las landings de pauta: municipio filtra cobertura y recargo por
      // movilidad; la franja convierte el lead en una cita concreta.
      municipio: municipio || null,
      franjaHoraria: franjaHoraria || null,
      formId: formId || 'unknown',
      source: 'agroincol-web',
      timestamp: new Date().toISOString(),
      page: page || '/',
      aceptaTerminos: aceptaTerminos !== false,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      politicaVersion: '2026-03-07',
    };

    const webhookUrl = process.env.WEBHOOK_URL;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (webhookError) {
        console.error('Error enviando al webhook:', webhookError);
        // Don't return error to user — the form data was received
      }
    } else {
      console.log('📋 Nuevo lead recibido (sin WEBHOOK_URL configurado):');
      console.log(JSON.stringify(payload, null, 2));
    }

    // ---------------------------------------------------------------------
    // Lead hacia la API de Conversiones de Meta.
    //
    // Va aquí y no en /api/meta porque este es el único punto donde existen el
    // nombre, el teléfono y el municipio. Se envían SIEMPRE hasheados y SOLO si
    // la persona autorizó el tratamiento de datos: sin autorización el evento
    // sale igual, pero únicamente con las señales técnicas del servidor.
    //
    // El event_id es el que ya usó el Pixel del navegador, así Meta deduplica y
    // el Lead cuenta una sola vez. Si el Pixel estaba bloqueado llega vacío y se
    // genera aquí: el evento sale por el servidor de todas formas.
    //
    // La medición nunca puede tumbar el lead: si Meta falla, se registra en los
    // logs y al visitante se le responde éxito igual.
    // ---------------------------------------------------------------------
    const respuesta = NextResponse.json({ success: true, message: 'Datos recibidos correctamente' });

    if (capiConfigurada()) {
      try {
        const ip =
          request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
          request.headers.get('x-real-ip') ||
          '';
        const url = typeof sourceUrl === 'string' && sourceUrl ? sourceUrl : `https://agroincol.com${page || '/'}`;
        const { fbp, generado } = resolverFbp(request.cookies.get('_fbp')?.value);
        const fbc = resolverFbc(request.cookies.get('_fbc')?.value, url);

        const userData = await userDataParaMeta(
          {
            nombreCompleto: nombre,
            telefono,
            correo: email || undefined,
            municipio: municipio || undefined,
            externalId: typeof externalId === 'string' ? externalId : undefined,
          },
          aceptaTerminos !== false
        );

        const envio = await enviarEventoAMeta({
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: typeof eventId === 'string' && eventId.length >= 8 ? eventId : nuevoEventId(),
          action_source: 'website',
          event_source_url: url,
          user_data: {
            ...userData,
            client_ip_address: ip || undefined,
            client_user_agent: request.headers.get('user-agent') ?? undefined,
            fbp,
            fbc,
          },
        });

        if (!envio.ok) {
          console.error('[meta] Lead no enviado:', envio.motivo, envio.detalle ?? '');
        }
        if (generado) {
          respuesta.cookies.set('_fbp', fbp, {
            maxAge: FBP_DURACION_S,
            path: '/',
            sameSite: 'lax',
            secure: true,
          });
        }
      } catch (error) {
        console.error('[meta] error inesperado enviando el Lead:', error);
      }
    }

    return respuesta;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud' },
      { status: 500 }
    );
  }
}
