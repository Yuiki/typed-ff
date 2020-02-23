import { firestore, EventContext, CloudFunction, Change } from "firebase-functions";
import { Collection, Doc, Ref } from "typesaurus";
export declare const onCreate: <Model>(collectionOrRef: Collection<Model> | Ref<Model>, handler: (doc: Doc<Model>, context: EventContext) => void) => CloudFunction<firestore.DocumentSnapshot>;
export declare const onUpdate: <Model>(collectionOrRef: Collection<Model>, handler: (change: Change<Doc<Model>>, context: EventContext) => void) => CloudFunction<Change<firestore.DocumentSnapshot>>;
export declare const onDelete: <Model>(collectionOrRef: Collection<Model>, handler: (doc: Doc<Model>, context: EventContext) => void) => CloudFunction<firestore.DocumentSnapshot>;
export declare const onWrite: <Model>(collectionOrRef: Collection<Model>, handler: (change: Partial<Change<Doc<Model>>>, context: EventContext) => void) => CloudFunction<Change<firestore.DocumentSnapshot>>;
