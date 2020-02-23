# typed-ff

Type-safe Firestore Triggers wrapper.

## Installation

```sh
yarn add typed-ff
```

## Examples

### Listen for changes in all documents in the collection

```ts
import { onCreate, onDelete, onUpdate, onWrite } from "typed-ff"
import { collection } from "typesaurus"

type User = { name: string }

const users = collection<User>("users")

export const onCreateUser = onCreate(users, (doc, context) => {
  doc // => Doc<User>
})

export const onDeleteUser = onDelete(users, (doc, context) => {
  doc // => Doc<User>
})

export const onUpdateUser = onUpdate(users, ({ before, after }, context) => {
  before // => Doc<User>
  after // => Doc<User>
})

export const onWriteUser = onWrite(users, ({ before, after }, context) => {
  before // => Doc<User> | undefined
  after // => Doc<User> | undefined
})
```

### Listen for any change on the document in the collection

```ts
import { onCreate } from "typed-ff"
import { collection, ref } from "typesaurus"

type User = { name: string }

const users = collection<User>("users")
const yuiki = ref(users, "yuiki")

export const onCreateUser = onCreate(yuiki, (doc, context) => {
  doc // => Doc<User>
})
```

### Listen for changes in all documents in the subcollection

```ts
import { onCreate } from "typed-ff"
import { collection, ref, subcollection } from "typesaurus"

type User = { name: string }
type Post = { text: string }

const users = collection<User>("users")
const posts = subcollection<Post, User>("posts", users)

// You should specify "{parentId}" to use a wildcard and avoid "{id}"
export const onCreateUser = onCreate(posts("{userId}"), (doc, context) => {
  doc // => Doc<Post>
})
```

### Tasks

- [ ] Add documents
- [ ] Add tests
