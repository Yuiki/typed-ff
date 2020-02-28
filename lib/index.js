"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_functions_1 = require("firebase-functions");
const typesaurus_1 = require("typesaurus");
const data_1 = require("typesaurus/data");
const getPathAndCollection = (collectionOrRef) => {
    let path;
    let collection;
    if (collectionOrRef.__type__ === "collection") {
        collection = collectionOrRef;
        path = `${collection.path}/{id}`;
    }
    else {
        collection = collectionOrRef.collection;
        path = `${collection.path}/{${collectionOrRef.id}}`;
    }
    return { path, collection };
};
exports.onCreate = (collectionOrRef, handler) => {
    const { path, collection } = getPathAndCollection(collectionOrRef);
    return firebase_functions_1.firestore.document(path).onCreate((snap, ctx) => {
        const data = data_1.wrapData(snap.data());
        return handler(typesaurus_1.doc(typesaurus_1.ref(collection, snap.id), data), ctx);
    });
};
exports.onUpdate = (collectionOrRef, handler) => {
    const { path, collection } = getPathAndCollection(collectionOrRef);
    return firebase_functions_1.firestore.document(path).onUpdate(({ before, after }, ctx) => {
        const beforeData = data_1.wrapData(before.data());
        const afterData = data_1.wrapData(after.data());
        const change = {
            before: typesaurus_1.doc(typesaurus_1.ref(collection, before.id), beforeData),
            after: typesaurus_1.doc(typesaurus_1.ref(collection, after.id), afterData)
        };
        return handler(change, ctx);
    });
};
exports.onDelete = (collectionOrRef, handler) => {
    const { path, collection } = getPathAndCollection(collectionOrRef);
    return firebase_functions_1.firestore.document(path).onDelete((snap, ctx) => {
        const data = data_1.wrapData(snap.data());
        return handler(typesaurus_1.doc(typesaurus_1.ref(collection, snap.id), data), ctx);
    });
};
exports.onWrite = (collectionOrRef, handler) => {
    const { path, collection } = getPathAndCollection(collectionOrRef);
    return firebase_functions_1.firestore.document(path).onWrite(({ before, after }, ctx) => {
        const beforeData = data_1.wrapData(before.data());
        const afterData = data_1.wrapData(after.data());
        const change = {
            before: beforeData && typesaurus_1.doc(typesaurus_1.ref(collection, before.id), beforeData),
            after: afterData && typesaurus_1.doc(typesaurus_1.ref(collection, after.id), afterData)
        };
        return handler(change, ctx);
    });
};
//# sourceMappingURL=index.js.map