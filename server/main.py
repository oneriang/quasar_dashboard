import json

from typing import List, Optional
from pydantic import BaseModel

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import typing
from pathlib import Path
import secrets

from fastapi import FastAPI, Request, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBasic, HTTPBasicCredentials


PathLike = typing.Union[str, "os.PathLike[str]"]
app = FastAPI()
security = HTTPBasic()


async def verify_username(request: Request) -> HTTPBasicCredentials:

    credentials = await security(request)

    correct_username = secrets.compare_digest(credentials.username, "user")
    correct_password = secrets.compare_digest(credentials.password, "password")
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


class AuthStaticFiles(StaticFiles):
    def __init__(self, *args, **kwargs) -> None:

        super().__init__(*args, **kwargs)

    async def __call__(self, scope, receive, send) -> None:

        assert scope["type"] == "http"

        request = Request(scope, receive)
        await verify_username(request)
        await super().__call__(scope, receive, send)

class Page(BaseModel):
    id: str
    to: str
    label: str
    name: str
    isOpened: bool
    editable: bool
    layout: Optional[List] = None

class Pages(BaseModel):
    pages: Optional[List[Page]] = None

app = FastAPI()

app.mount(
    "/static",
    AuthStaticFiles(directory="static", html=True),
    name="static",
)

origins = [
    '*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/api/pages")
def read_pages():
    f = open('pages.json', 'r')
    pages = json.load(f)
    return pages

@app.put("/api/pages")
def update_pages(pages: Pages):
    with open('pages.json', 'w') as f:
        json.dump(pages.dict(), f, indent=4)
    return pages

@app.get("/api/page")
def read_page():
    f = open('page.json', 'r')
    page = json.load(f)
    return page

@app.put("/api/page")
def update_page(page: Page):
    print(page)
    print(page.id)
    with open('page_' + str(page.id) + '.json', 'w') as f:
        json.dump(page.dict(), f, indent=4)
    return page


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
