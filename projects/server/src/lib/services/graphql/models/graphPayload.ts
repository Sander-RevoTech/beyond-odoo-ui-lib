import { TypedDocumentNode } from 'apollo-angular';

export interface GraphQueryPayload {
  query: any;
  variables: any;
}

export interface GraphMutationPayload {
  mutation: TypedDocumentNode<unknown, unknown>;
  variables: any;
}
