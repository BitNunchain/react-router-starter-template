"use client";
import Link from 'next/link';
import styles from './error.module.css';

export default function ErrorPage() {
  return (
    <html lang="en">
      <head>
        <title>Error - BTN Blockchain</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <main className={styles.errorPage}>
          <h1 className={styles.errorTitle}>Something went wrong</h1>
          <h2 className={styles.title}>Application Error</h2>
          <p className={styles.errorDescription}>
            A client-side exception has occurred.<br />
            Please check the browser console for more information.
          </p>
          <Link href="/" className={styles.returnHomeLink}>Return to Home</Link>
        </main>
      </body>
    </html>
  );
}
