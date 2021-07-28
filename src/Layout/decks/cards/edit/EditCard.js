import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from "react-router-dom";
import { updateCard, readDeck, readCard } from "../../../../utils/api/index";
import EditAddForm from '../EditAddForm';

function EditCard() {
    const history = useHistory();
    const { cardId, deckId } = useParams();
    const [currentDeck, setCurrentDeck] = useState({id: deckId});
    const [currentCard, setCurrentCard] = useState({});

    useEffect(() => {
        const abortController = new AbortController();

        const setDeckAndCard = async() => {
            console.log("deckid", deckId);
            const deck = await readDeck(deckId, abortController.signal);
            const card = await readCard(cardId, abortController.signal);
            setCurrentDeck(deck);
            setCurrentCard(card);
        }

        setDeckAndCard();
        
        return () => abortController.abort();
    }, [cardId, deckId]);

    const handleDone= () => {
        history.push(`/decks/${deckId}`);
    }

    const handleSave = async(e) => {
        e.preventDefault();
        const abortController = new AbortController();
        await updateCard(currentCard, abortController.signal);
        history.push(`/decks/${deckId}`);
    }

    const handleChange = ({ target }) => {
        setCurrentCard({
            ...currentCard,
            [target.name]: target.value
        })
    }
    

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" >Home</Link></li>
                    <Link className="breadcrumb-item" to={`/decks/${deckId}`}>Deck {currentDeck.name}</Link>
                    <li className="breadcrumb-item text-secondary" aria-current="page">Edit Card {cardId}</li>
                </ol>
            </nav>
            <h2>Edit Card</h2>
            <EditAddForm 
                cardInfo={currentCard} setCardInfo={setCurrentCard}
                handleChange={handleChange} handleDone={handleDone}
                handleSave={handleSave}
            />
        </div>
    )
}

export default EditCard