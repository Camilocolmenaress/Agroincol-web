import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { nombre, telefono, tipoServicio, email, direccion, mensaje, formId, page, website } = body;

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
      formId: formId || 'unknown',
      source: 'agroincol-web',
      timestamp: new Date().toISOString(),
      page: page || '/',
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

    return NextResponse.json({ success: true, message: 'Datos recibidos correctamente' });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error procesando la solicitud' },
      { status: 500 }
    );
  }
}
