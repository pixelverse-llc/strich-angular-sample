# STRICH SDK Angular sample code

This repository shows to integrate STRICH SDK in an Angular project.
You need a valid license key to run this sample. To get started with STRICH SDK, check out to the [Getting Started](https://docs.strich.io/getting-started.html) guide.

More on integrating our SDK into Angular apps can be found in the [Angular Integration Guide](https://docs.strich.io/angular-integration-guide.html).

## Running the Sample

To run the project, install the dependencies and then run the development server:

```shell
npm install
npm run start
```

The app will be available on http://localhost:4200.

There is a [PDF test sheet](test-sheet.pdf) included in this repository for testing. If you need to create your own barcodes, use [Barcode.new](https://barcode.new) or an alternative barcode generator.

## Testing with a Smartphone

You are likely developing a smartphone app, and since the development server is only available on localhost, you will have trouble connecting to it.

We recommend using tools like [Ngrok](https://ngrok.com) that expose your local development server on a public address that you can access from your smartphone, see our section [Testing on a Smartphone](https://docs.strich.io/getting-started.html#testing-on-a-smartphone).
