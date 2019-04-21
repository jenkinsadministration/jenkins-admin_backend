import schema from "./schema";
import app from "../api";


const {graphiqlExpress, graphqlExpress} = require('apollo-server-express');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { printSchema } = require('graphql/utilities/schemaPrinter');

const graphQLServer = express();

app.use(cors({origin: true}));

graphQLServer.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress({ schema, context: {} })
);

// /api/graphiql
graphQLServer.use(
    "/graphiql",
    graphiqlExpress({ endpointURL: "/jenkinsadmin/us-central1/query/graphql" })
);

// /api/schema
graphQLServer.use("/schema", (req: any, res: any) => {
    res.set("Content-Type", "text/plain");
    res.send(printSchema(schema));
});

export default graphQLServer;

