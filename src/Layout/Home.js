import React from 'react';
import { Link, useRouteMatch } from "react-router-dom";
import { deleteDeck } from "../utils/api/index";

function Home({ currentDeckList, setCurrentDeckList }) {
    const { url } = useRouteMatch();

    const handleDelete = (id) => {
        if (window.confirm("Delete this deck?\nYou will not be able to recover it.")) {
            const abortController = new AbortController();
            const filterDeck = currentDeckList.filter(deck => deck.id !== id);
            setCurrentDeckList([...filterDeck]);
            deleteDeck(id, abortController.signal);
        }         
    }
    
    return (
        <div>
            <Link to="/decks/new" className="btn btn-secondary" style={{marginBottom: "0.5rem"}}>Create Deck</Link>
            {
                currentDeckList.map(deck => {
                    const { id, name, description, cards } = deck;
                    return (
                        <div key={id} className="card-body" style={{border: "1px solid gray"}}>
                            <h5 className="card-title" style={{display: "inline-block"}}>{name}</h5> 
                            <span style={{float: "right"}}>{cards.length} cards</span>
                            <p className="card-text">{description}</p>
                            <Link to={`${url}decks/${id}`} className="btn btn-secondary">View</Link>
                            <Link to={`${url}decks/${id}/study`} className="btn btn-primary" style={{marginLeft: "0.5rem"}}>Study</Link>
                            <button className="btn btn-danger" style={{float: "right"}} onClick={() => handleDelete(id)}>Delete</button>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home
