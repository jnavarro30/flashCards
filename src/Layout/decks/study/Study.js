import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, listCards, readCard } from "../../../utils/api/index";

function Study() {
    const { deckId } = useParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    const history = useHistory();
    const [deckInfo, setDeckInfo] = useState({});
    const [cardList, setCardList] = useState([]);
    const [cardInfo, setCardInfo] = useState({});
    const [flip, setFlip] = useState(true);
    

    useEffect(() => {
        const abortController = new AbortController();

        const setDeckAndCards = async() => {
            const currentDeck = await readDeck(deckId, abortController.signal);
            const currentCards = await listCards(deckId, abortController.signal);
            const currentCard = currentCards.length ? await readCard(currentCards[currentIndex].id, abortController.signal) : {};

            setDeckInfo(currentDeck);
            setCardList([...currentCards]);
            setCardInfo(currentCard);
        }
    
        setDeckAndCards();
    }, [deckId, currentIndex])

    
    const handleFlip = () => {
        setFlip(!flip);
    }

    const handleNext = () => { 
        setFlip(!flip);
        setCurrentIndex(currentIndex + 1);
        if ((currentIndex + 1) === cardList.length) {
            if (window.confirm("Restart cards?\nClick 'cancel' to return to the home page.")) setCurrentIndex(0); 
            else  history.push("/");   
        }
    }

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" >Home</Link></li>
                    <li className="breadcrumb-item"><Link to={`/decks/${deckId}`}>{deckInfo.name}</Link></li>
                    <li className="breadcrumb-item" aria-current="page">Study</li>
                </ol>
            </nav>
            <h2>Study: {deckInfo.name}</h2>
            {
                cardList.length > 2 ? <div className="card-body" style={{border: "1px solid gray"}}>
                <h4>Card {currentIndex + 1} of {cardList.length}</h4>
                <p className="card-text">{flip ? cardInfo.front : cardInfo.back }</p>
                <button className="btn btn-secondary" onClick={handleFlip}>Flip</button>
                {flip ? "" : <button className="btn btn-primary" style={{marginLeft: "0.5rem"}} onClick={handleNext}>Next</button>}
            </div> :
            <div>
                <h4>Not enough cards.</h4>
                <p>You need at least 3 cards to study. There are {cardList.length} cards in this deck.</p>
                <Link to={`/decks/${deckId}/cards/new`} className="btn btn-primary" style={{marginLeft: "0.5rem"}}>Add Cards</Link>
            </div>
            }
        </div>
    )
}

export default Study