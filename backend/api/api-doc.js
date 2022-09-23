const apiDoc = {
    swagger: "2.0",
    basePath: "/",
    info: {
      title: "Change Request API.",
      version: "1.0.0",
    },
    definitions: {
      PutChangeRequest: {
        type: "object",
        properties: { 
          id: {
            type: "string",
          },
          status: {
            type: "string",
          },
          message: {
            type: "string",
          },
        },
        required: ["tracking_branch","original_branch","origin_database","message"],
      },
      PostChangeRequest: {
        type: "object",
        properties: {
          tracking_branch: {
            type: "string",
          },
          original_branch: {
            type: "string",
          },
          origin_database: {
            type: "string",
          },
          message: {
            type: "string",
          },

        },
        required: ["tracking_branch","original_branch","origin_database","message"],
      },

      ChangeRequest: {
        type: "object",
        properties: {
          id: {
            type: "string",
          },
          status: {
            type: "string",
          },
          tracking_branch: {
            type: "string",
          },
          original_branch: {
            type: "string",
          },
          origin_database: {
            type: "string",
          },
          message: {
            type: "string",
          },

        },
        required: ["id", "message","status","tracking_branch","original_branch","origin_database"],
      },
    },
    paths: {},
  };
  
  module.exports = apiDoc;