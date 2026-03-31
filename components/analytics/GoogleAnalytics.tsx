const GA_ID = 'G-M0V6SN0Z6V';

export default function GoogleAnalytics() {
  return (
    <>
      <script
        type="text/partytown"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <script
        type="text/partytown"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
    </>
  );
}
