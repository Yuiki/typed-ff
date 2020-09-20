"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onWrite = exports.onDelete = exports.onUpdate = exports.onCreate = void 0;
const firebase_functions_1 = require("firebase-functions");
const typesaurus_1 = require("typesaurus");
const data_1 = require("typesaurus/data");
const adaptor_1 = __importDefault(require("typesaurus/adaptor"));
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
    return firebase_functions_1.firestore.document(path).onCreate((snap, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const a = yield adaptor_1.default();
        const data = data_1.wrapData(a, snap.data());
        return handler(typesaurus_1.doc(typesaurus_1.ref(collection, snap.id), data), ctx);
    }));
};
exports.onUpdate = (collectionOrRef, handler) => {
    const { path, collection } = getPathAndCollection(collectionOrRef);
    return firebase_functions_1.firestore.document(path).onUpdate(({ before, after }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const a = yield adaptor_1.default();
        const beforeData = data_1.wrapData(a, before.data());
        const afterData = data_1.wrapData(a, after.data());
        const change = {
            before: typesaurus_1.doc(typesaurus_1.ref(collection, before.id), beforeData),
            after: typesaurus_1.doc(typesaurus_1.ref(collection, after.id), afterData),
        };
        return handler(change, ctx);
    }));
};
exports.onDelete = (collectionOrRef, handler) => {
    const { path, collection } = getPathAndCollection(collectionOrRef);
    return firebase_functions_1.firestore.document(path).onDelete((snap, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const a = yield adaptor_1.default();
        const data = data_1.wrapData(a, snap.data());
        return handler(typesaurus_1.doc(typesaurus_1.ref(collection, snap.id), data), ctx);
    }));
};
exports.onWrite = (collectionOrRef, handler) => {
    const { path, collection } = getPathAndCollection(collectionOrRef);
    return firebase_functions_1.firestore.document(path).onWrite(({ before, after }, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const a = yield adaptor_1.default();
        const beforeData = data_1.wrapData(a, before.data());
        const afterData = data_1.wrapData(a, after.data());
        const change = {
            before: beforeData && typesaurus_1.doc(typesaurus_1.ref(collection, before.id), beforeData),
            after: afterData && typesaurus_1.doc(typesaurus_1.ref(collection, after.id), afterData),
        };
        return handler(change, ctx);
    }));
};
//# sourceMappingURL=index.js.map