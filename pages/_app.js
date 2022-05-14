import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (<>
    <Head>
      <title>haniChart: Trouvez et partagez des hentai saisonniers</title>
      <link rel='icon' href='/favicon.ico' />
      <link
        href='https://fonts.googleapis.com/icon?family=Material+Icons'
        rel='stylesheet'>
      </link>
    </Head>
    <Component {...pageProps} />
  </>)
}

export default MyApp;