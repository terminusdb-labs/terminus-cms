module.exports = function () {
    let operations = {
      GET,
      POST,
      PUT,
      DELETE,
    };
  
    function GET(req, res, next) {
      res.status(200).json([
        { "@type" : "ChangeRequest",
        "@id" : "hdhdjjaKWOWIOIELLLLFL[Q",
        "origin_database" : "DBNAME",
        "status" : "Submitted",
        "tracking_branch" : "djjdjqwklwkl;qle;l;",
        "original_branch" : "dkdkelp3dmddkdkdkkdkdkk" }
      ]);
    }
  
    function POST(req, res, next) {
      console.log(`About to create Change Request: ${JSON.stringify(req.body)}`);
      res.status(201).send();
    }
  
    function PUT(req, res, next) {
      console.log(`About to update Change Request status: ${req.query.status}`);
      res.status(200).send();
    }
  
    function DELETE(req, res, next) {
      console.log(`About to delete Change Request id: ${req.query.id}`);
      res.status(200).send();
    }
  
    GET.apiDoc = {
      summary: "Fetch Change requests.",
      operationId: "getChangeRequests",
      responses: {
        200: {
          description: "List of change requests.",
          schema: {
            type: "array",
            items: {
              $ref: "#/definitions/ChangeRequest",
            },
          },
        },
      },
    };
  
    POST.apiDoc = {
      summary: "Create Change Request.",
      operationId: "createChangeRequest",
      consumes: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "change request",
          schema: {
            $ref: "#/definitions/PostChangeRequest",
          },
        },
      ],
      responses: {
        201: {
          description: "Created",
        },
      },
    };
  
    PUT.apiDoc = {
      summary: "Update Change Request.",
      operationId: "updateChangeRequest",
      parameters: [
        {
          in: "query",
          name: "status",
          required: true,
          type: "string",
        },
        {
          in: "body",
          name: "change request",
          schema: {
            $ref: "#/definitions/PutChangeRequest",
          },
        },
      ],
      responses: {
        200: {
          description: "Updated ok",
        },
      },
    };
  
    DELETE.apiDoc = {
      summary: "Delete Change Request.",
      operationId: "deleteChangeRequest",
      consumes: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "Delete",
        },
      },
    };
  
    return operations;
  };