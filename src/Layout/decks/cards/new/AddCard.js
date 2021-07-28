import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from "react-router-dom";
import { readDeck, createCard } from "../../../../utils/api/index";
import EditAddForm from '../EditAddForm';

function AddCard() {
    const { deckId } = useParams();
    const history = useHistory();
    const [currentDeck, setCurrentDeck] = useState({name: ""});
    const [newCard, setNewCard] = useState({front: "", back: ""});

    useEffect(() => {
        const abortController = new AbortController();
        const loadDeck = async() => {
            const deck = await readDeck(deckId, abortController.signal);
            setCurrentDeck({
                name: deck.name
            })
        }
        loadDeck();
    }, [deckId]);

    const handleDone = (e) => {
        e.preventDefault();
        history.push(`/decks/${deckId}`);
    }

    const handleSave = async(e) => {
        e.preventDefault();
        if (!newCard.front || !newCard.back) return;
        const abortController = new AbortController();
        await createCard(deckId, newCard, abortController.signal);
        setNewCard({front: "", back: ""});
    }

    const handleChange = ({ target }) => {
        setNewCard({
            ...newCard,
            [target.name]: target.value
        })
    }

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" >Home</Link></li>
                    <Link className="breadcrumb-item" to={`/decks/${deckId}`}>{currentDeck.name}</Link>
                    <li className="breadcrumb-item text-secondary" aria-current="page">Add Card</li>
                </ol>
            </nav>
            <h2>{currentDeck.name}: Add Card</h2>
            <EditAddForm 
                cardInfo={newCard} setCardInfo={setNewCard}
                handleChange={handleChange} handleDone={handleDone}
                handleSave={handleSave}
            />
        </div>
    )
}

export default AddCard
