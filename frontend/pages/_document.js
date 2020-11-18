import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300&display=swap" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.26.19/antd.min.css" />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/4.8.4/antd.min.js" integrity="sha512-aLsUwA1b4M76LqsabiJnR5hCYLFuMaK2CbOLfLtHUzWi28I6zOpNtogMbdXkUBvoUc/mGvBIwQmwIdwrtzDemQ==" crossOrigin="anonymous"></script>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument