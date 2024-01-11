
# Notes API Documentation

## Overview

このAPIはノートの作成、取得、更新、削除を行うためのエンドポイントを提供します。

## API Endpoints

### GET /api/v1/notes
全てのノートを取得します。

#### Request
```
GET /api/v1/notes
Accept: application/json
```

#### Response
```
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "title": "Sample Note",
    "body": "This is a sample note.",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  ...
]
```

### POST /api/v1/notes
新しいノートを作成します。

#### Request
```
POST /api/v1/notes
Accept: application/json
Content-Type: application/json

{
  "note": {
    "title": "New Note",
    "body": "Content of the new note."
  }
}
```

#### Response
```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 2,
  "title": "New Note",
  "body": "Content of the new note.",
  "created_at": "2024-01-02T00:00:00.000Z",
  "updated_at": "2024-01-02T00:00:00.000Z"
}
```

### GET /api/v1/notes/:id
特定のノートを取得します。

#### Request
```
GET /api/v1/notes/1
Accept: application/json
```

#### Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "title": "Sample Note",
  "body": "This is a sample note.",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### PUT /api/v1/notes/:id
指定されたIDのノートを更新します。

#### Request
```
PUT /api/v1/notes/1
Accept: application/json
Content-Type: application/json

{
  "note": {
    "title": "Updated Title",
    "body": "Updated content."
  }
}
```

#### Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "title": "Updated Title",
  "body": "Updated content.",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-02T00:00:00.000Z"
}
```

### DELETE /api/v1/notes/:id
指定されたIDのノートを削除します。

#### Request
```
DELETE /api/v1/notes/1
Accept: application/json
```

#### Response
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Note was successfully deleted."
}
```
