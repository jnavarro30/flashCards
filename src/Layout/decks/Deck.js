import React, { useState, useEffect } from 'react';
import { Link, useParams, useRouteMatch, useHistory } from "react-router-dom";
import { readDeck, listCards, deleteDeck, deleteCard } from "../../utils/api/index";

function Deck({ currentDeckList, setCurrentDeckList }) {
    const { url } = useRouteMatch();
    const history = useHistory();
    const { deckId } = useParams();
    const [deckInfo, setDeckInfo] = useState({});
    const [currentCards, setCurrentCards] = useState([]);

    useEffect(() => {
        const abortController = new AbortController();

        const getDeck = async() => {
            const deck = await readDeck(deckId, abortController.signal);
            const cards = await listCards(deckId, abortController.signal);
            setDeckInfo(deck);
            setCurrentCards([...cards]);
        }

        getDeck();

        // watching...
        return () => abortController.abort();
    }, [deckId])

    const handleDeleteDeck = (id) => {
        if (window.confirm("Delete this deck?\nYou will not be able to recover it.")) {
            console.log("Working");
            const abortController = new AbortController();
            
            const deckDeletion = async() => {
                const filterDeck = currentDeckList.filter(deck => deck.id !== Number(deckId));
                console.log(filterDeck);
                setCurrentDeckList([...filterDeck]);
                deleteDeck(deckId, abortController.signal);
                history.push("/");
            } 
            deckDeletion();
            return abortController.abort();
        }         
    }

    const handleDeleteCard = (id) => {
        console.log("functioning")
        if (window.confirm("Delete this card?\nYou will not be able to recover it.")) {
            const abortController = new AbortController();

            const cardDeletion = async() => {
                console.log('1')
                await deleteCard(id, abortController.signal);
                console.log('2')
                const filtered = currentCards.filter(card => card.id !== id);
                console.log(filtered)
                setCurrentCards([...filtered]);
            }

            cardDeletion();
            return () => abortController.abort();
        }         
    }

    const cardStyle = {
        display: "grid",
        gridAutoFlow: "column",
        gridTemplateColumns: "1fr 1fr",
        gridGap: "1rem"
    }

    const renderCards = currentCards.map(card => {
        const { id, front, back } = card;
        return (
            <div key={id}>
            <div className="card-body" style={{border: "1px solid gray"}}>
                <div style={cardStyle}>
                    <p className="card-text">{front}</p>
                    <p className="card-text">{back}</p>
                </div>
                <Link to={`${url}/cards/${id}/edit`} className="btn btn-secondary" style={{marginRight: "0.5rem"}}>Edit</Link>
                <button className="btn btn-danger" onClick={() => handleDeleteCard(id)}>Delete</button>
            </div>
        </div>
        )
    });
    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" >Home</Link></li>
                    <li className="breadcrumb-item text-secondary" aria-current="page">{deckInfo.name}</li>
                </ol>
            </nav>
            <div className="card-body">
                <h5 className="card-title">{deckInfo.name}</h5> 
                <p className="card-text">{deckInfo.description}</p>
                <Link to={`${url}/edit`} className="btn btn-secondary">Edit</Link>
                <Link to={`${url}/study`} className="btn btn-primary" style={{marginLeft: "0.5rem"}}>Study</Link>
                <Link to={`${url}/cards/new`} className="btn btn-primary"  style={{marginLeft: "0.5rem"}}>Add Cards</Link>
                <button className="btn btn-danger" style={{float: "right"}} onClick={() => handleDeleteDeck(deckId)}>Delete</button>
            </div>
            <div style={{marginBottom: "1rem"}}>
                <h2>Cards</h2>
                {renderCards}
            </div>
        </div>
    )
}

export default Deck
