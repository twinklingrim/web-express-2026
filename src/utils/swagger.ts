import swaggerJSdoc from "swagger-jsdoc";

const options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Express API",
      version: "1.0.0",
      description: "REST API documentation for web-express-2026",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routers/*.ts"],
};

export const openapiSpecification = swaggerJSdoc(options);
