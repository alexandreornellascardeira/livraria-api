export const swaggerDocument =
{
    "swagger": "2.0",
    "info": {
        "description": "Petshop API description",
        "version": "1.0.0",
        "title": "Petshop API description"
    },
    "host": "localhost:3000",
    "tags": [
        {
            "name": "proprietario",
            "description": "Proprietario management"
        },
        {
            "name": "animal",
            "description": "Animal management"
        },

    ],
    "paths": {
        "/proprietario": {
            "get": {
                "tags": [
                    "proprietario"
                ],
                "summary": "Get existing proprietarios",
                "description": "Get existing proprietario description",
                "produces": [
                    "application/json"
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/Proprietario"
                            }
                        }
                    },
                    "400": {
                        "description": "Error occurred"
                    }
                }
            },
            "post": {
                "tags": [
                    "proprietario"
                ],
                "summary": "Create a new proprietario",
                "description": "Create a new proprietario with the received parameters",
                "consumes": [
                    "application/json"
                ],
                "parameters": [
                    {
                        "in": "body",
                        "name": "body",
                        "description": "Proprietario object",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/Proprietario"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Proprietario created"
                    },
                    "400": {
                        "description": "Error occurred"
                    }
                }
            }
        }
    },
    "definitions": {
        "Proprietario": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string",
                    "example": "Guilherme Assis"
                },
                "balance": {
                    "type": "number",
                    "example": 742.34
                }
            }
        }
    }
};