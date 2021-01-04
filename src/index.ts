import {
  firestore,
  EventContext,
  CloudFunction,
  Change,
} from "firebase-functions"
import { Collection, Doc, doc, pathToRef, Ref } from "typesaurus"
import { wrapData } from "typesaurus/data"
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase-functions/lib/providers/firestore"
import adaptor from "typesaurus/adaptor"

const getPathAndCollection = <Model>(
  collectionOrRef: Collection<Model> | Ref<Model>
): { path: string; collection: Collection<Model> } => {
  let path: string
  let collection: Collection<Model>
  if (collectionOrRef.__type__ === "collection") {
    collection = collectionOrRef
    path = `${collection.path}/{id}`
  } else {
    collection = collectionOrRef.collection
    path = `${collection.path}/{${collectionOrRef.id}}`
  }
  return { path, collection }
}

export const onCreate = <Model>(
  collectionOrRef: Collection<Model> | Ref<Model>,
  handler: (doc: Doc<Model>, context: EventContext) => any
): CloudFunction<QueryDocumentSnapshot> => {
  const { path } = getPathAndCollection(collectionOrRef)

  return firestore.document(path).onCreate(async (snap, ctx) => {
    const a = await adaptor()
    const data = wrapData(a, snap.data()) as Model

    return handler(doc(pathToRef(snap.ref.path), data), ctx)
  })
}

export const onUpdate = <Model>(
  collectionOrRef: Collection<Model>,
  handler: (change: Change<Doc<Model>>, context: EventContext) => any
): CloudFunction<Change<QueryDocumentSnapshot>> => {
  const { path } = getPathAndCollection(collectionOrRef)

  return firestore.document(path).onUpdate(async ({ before, after }, ctx) => {
    const a = await adaptor()
    const beforeData = wrapData(a, before.data()) as Model
    const afterData = wrapData(a, after.data()) as Model
    const change = {
      before: doc(pathToRef<Model>(before.ref.path), beforeData),
      after: doc(pathToRef<Model>(after.ref.path), afterData),
    }
    return handler(change, ctx)
  })
}

export const onDelete = <Model>(
  collectionOrRef: Collection<Model>,
  handler: (doc: Doc<Model>, context: EventContext) => any
): CloudFunction<QueryDocumentSnapshot> => {
  const { path } = getPathAndCollection(collectionOrRef)

  return firestore.document(path).onDelete(async (snap, ctx) => {
    const a = await adaptor()
    const data = wrapData(a, snap.data()) as Model
    return handler(doc(pathToRef(snap.ref.path), data), ctx)
  })
}

export const onWrite = <Model>(
  collectionOrRef: Collection<Model>,
  handler: (change: Partial<Change<Doc<Model>>>, context: EventContext) => any
): CloudFunction<Change<DocumentSnapshot>> => {
  const { path } = getPathAndCollection(collectionOrRef)

  return firestore.document(path).onWrite(async ({ before, after }, ctx) => {
    const a = await adaptor()
    const beforeData = wrapData(a, before.data()) as Model | undefined
    const afterData = wrapData(a, after.data()) as Model | undefined

    const change = {
      before: beforeData && doc(pathToRef<Model>(before.ref.path), beforeData),
      after: afterData && doc(pathToRef<Model>(after.ref.path), afterData),
    }
    return handler(change, ctx)
  })
}
