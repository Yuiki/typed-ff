import {
  firestore,
  EventContext,
  CloudFunction,
  Change
} from "firebase-functions"
import { Collection, Doc, doc, ref, Ref } from "typesaurus"
import { wrapData } from "typesaurus/data"
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore"

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
  handler: (doc: Doc<Model>, context: EventContext) => void
): CloudFunction<DocumentSnapshot> => {
  const { path, collection } = getPathAndCollection(collectionOrRef)

  return firestore.document(path).onCreate((snap, ctx) => {
    const data = wrapData(snap.data()) as Model
    handler(doc(ref(collection, snap.id), data), ctx)
  })
}

export const onUpdate = <Model>(
  collectionOrRef: Collection<Model>,
  handler: (change: Change<Doc<Model>>, context: EventContext) => void
): CloudFunction<Change<DocumentSnapshot>> => {
  const { path, collection } = getPathAndCollection(collectionOrRef)

  return firestore.document(path).onUpdate(({ before, after }, ctx) => {
    const beforeData = wrapData(before.data()) as Model
    const afterData = wrapData(before.data()) as Model
    const change = {
      before: doc(ref(collection, before.id), beforeData),
      after: doc(ref(collection, after.id), afterData)
    }
    handler(change, ctx)
  })
}

export const onDelete = <Model>(
  collectionOrRef: Collection<Model>,
  handler: (doc: Doc<Model>, context: EventContext) => void
): CloudFunction<DocumentSnapshot> => {
  const { path, collection } = getPathAndCollection(collectionOrRef)

  return firestore.document(path).onDelete((snap, ctx) => {
    const data = wrapData(snap.data()) as Model
    handler(doc(ref(collection, snap.id), data), ctx)
  })
}

export const onWrite = <Model>(
  collectionOrRef: Collection<Model>,
  handler: (change: Partial<Change<Doc<Model>>>, context: EventContext) => void
): CloudFunction<Change<DocumentSnapshot>> => {
  const { path, collection } = getPathAndCollection(collectionOrRef)

  return firestore.document(path).onWrite(({ before, after }, ctx) => {
    const beforeData = wrapData(before.data()) as Model | undefined
    const afterData = wrapData(before.data()) as Model | undefined
    const change = {
      before: beforeData && doc(ref(collection, before.id), beforeData),
      after: afterData && doc(ref(collection, after.id), afterData)
    }
    handler(change, ctx)
  })
}
