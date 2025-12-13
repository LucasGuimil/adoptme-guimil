export const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API adoptme",
            version: "1.0.0",
            description: "API-REST created to handle pet adoptions of a shelter."
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development",
            },
            {
                url: "http://localhost:8080",
                description: "Production",
            },
        ]
    },
    apis: ["./src/docs/*.yaml"]
}

