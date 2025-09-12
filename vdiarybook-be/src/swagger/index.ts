import YAML from "yamljs"
import { OpenAPIV3} from "openapi-types"

const authDoc = YAML.load("./src/swagger/paths/auth.yaml") as OpenAPIV3.Document;
const friendDoc = YAML.load("./src/swagger/paths/friend.yaml") as OpenAPIV3.Document;


export const swaggerDocument: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "VDiaryBook API",
    version: "1.0.0",
    description: "Tài liệu Swagger theo module",
  },
  servers: [{ url: "http://localhost:8080" }],

  security: [
    {
      bearerAuth: []
    }
  ],

  paths: {
    ...authDoc.paths,
    ...friendDoc.paths,
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ...authDoc.components?.schemas,
      ...friendDoc.components?.schemas,
    }
  }
}