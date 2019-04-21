import { makeExecutableSchema } from "graphql-tools"
import { resolvers } from './resolvers';

const schema = `
type CredentialBody {
  name: String
}
type Credential {
    id: String
    data: CredentialBody
}
type EnvironmentVarBody {
  name: String
}
type EnvironmentVar {
    id: String
    data: EnvironmentVarBody
}
type PluginBody {
  name: String
}
type Plugin {
    id: String
    data: PluginBody
}
type AtheneaProject {
    project_id: String
    environment_id: String
}
type JobSetupCron {
    build: String
    poll_scm: String
}
type JobSetup {
    repository: String
    branch: String
    log_rotate: Int
    template: String
    cron: JobSetupCron
}
type Job {
    full_name: String
    platform: String
    browser: String
    type: String
    setup: JobSetup
    athenea_project: AtheneaProject
}
type JobInterface {
    build: [Job]
    test: [Job]
}
type ProjectBody {
  name: String
  path: String
  jobs: JobInterface
}
type Project {
    id: String
    data: ProjectBody
}
type ToolConfigurationBody {
  name: String
}
type ToolConfiguration {
    id: String
    data: ToolConfigurationBody
}
# the schema allows the following query:
type Query {
  credentials: [Credential]
  environment_vars: [EnvironmentVar]
  plugins: [Plugin]
  jobs: [Job]
  projects: [Project]
  tool_configurations: [ToolConfiguration]
}
`;

export default makeExecutableSchema({
    typeDefs: schema,
    resolvers: resolvers
})
