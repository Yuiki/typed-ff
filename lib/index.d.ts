import { EventContext, CloudFunction, Change } from "firebase-functions";
import { Collection, Doc, Ref } from "typesaurus";
import { DocumentSnapshot, QueryDocumentSnapshot } from "firebase-functions/lib/providers/firestore";
export declare const onCreate: <Model>(collectionOrRef: Collection<Model> | Ref<Model>, handler: (doc: Doc<Model>, context: EventContext) => any) => CloudFunction<QueryDocumentSnapshot>;
export declare const onUpdate: <Model>(collectionOrRef: Collection<Model>, handler: (change: Change<Doc<Model>>, context: EventContext) => any) => CloudFunction<Change<QueryDocumentSnapshot>>;
export declare const onDelete: <Model>(collectionOrRef: Collection<Model>, handler: (doc: Doc<Model>, context: EventContext) => any) => CloudFunction<QueryDocumentSnapshot>;
export declare const onWrite: <Model>(collectionOrRef: Collection<Model>, handler: (change: Partial<Change<Doc<Model>>>, context: EventContext) => any) => CloudFunction<Change<DocumentSnapshot>>;
