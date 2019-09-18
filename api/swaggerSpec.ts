import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    swagger: '2.0',
    info: {
      title: 'Clothes catalog',
      version: '1.0.0',
    },
  },
  apis: [
    './src/controllers/BrandsController.ts',
    './src/controllers/CatalogController.ts',
    './src/controllers/TypesSizesController.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
