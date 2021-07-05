import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { listDecks } from "../utils/api/index";
import Header from "./Header";
import Home from "./Home";
import Deck from "./decks/Deck";
import Study from "./decks/study/Study";
import CreateDeck from "./decks/new/CreateDeck";
import EditDeck from "./decks/edit/EditDeck";
import AddCard from "./decks/cards/new/AddCard";
import EditCard from "./decks/cards/edit/EditCard";
import NotFound from "./NotFound";

function Layout() {
  const [currentDeckList, setCurrentDeckList] = useState([]);
  const [renderDecks, setRenderDecks] = useState(true);
  const [createdDeckId, setCreatedDeckId] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();

    const loadDecks = async() => {
        const decks = await listDecks(abortController.signal);
        setCurrentDeckList([...decks]);
    }

    loadDecks();
}, [renderDecks]);

  return (
    <>
      <Header />
      <div className="container">
        {/* TODO: Implement the screen starting here */}
        <Switch>
          <Route exact path="/">
            <Home 
              currentDeckList={currentDeckList} setCurrentDeckList={setCurrentDeckList}
            />
          </Route>
          <Route exact path="/decks/new">
            <CreateDeck 
              renderDecks={renderDecks} setRenderDecks={setRenderDecks}
              currentDeckList={currentDeckList} setCurrentDeckList={setCurrentDeckList}
              createdDeckId={createdDeckId} setCreatedDeckId={setCreatedDeckId}
            />
          </Route>
          <Route exact path="/decks/:deckId">
            <Deck 
              currentDeckList={currentDeckList} setCurrentDeckList={setCurrentDeckList}
            />
          </Route>
          <Route exact path="/decks/:deckId/study">
            <Study />
          </Route>
          <Route exact path="/decks/:deckId/edit">
            <EditDeck renderDecks={renderDecks} setRenderDecks={setRenderDecks} />
          </Route>
          <Route exact path="/decks/:deckId/cards/new">
            <AddCard />
          </Route>
          <Route exact path="/decks/:deckId/cards/:cardId/edit">
            <EditCard />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default Layout;
