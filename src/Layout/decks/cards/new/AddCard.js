import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, createCard } from "../../../../utils/api/index";

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

    const handleDone = () => {
        history.push(`/decks/${deckId}`);
    }

    const handleSave = async(e) => {
        e.preventDefault();
        if (!newCard.front || !newCard.back) return;
        const abortController = new AbortController();
        await createCard(deckId, newCard, abortController.signal);
        setNewCard({front: "", back: ""});
        document.querySelector("#front").value = "";
        document.querySelector("#back").value = "";
    }

    const onChangeFront = (event) => {
        setNewCard({
            ...newCard,
            front: event.target.value
        })
    }

    const onChangeBack = (event) => {
        setNewCard({
            ...newCard,
            back: event.target.value
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
            <form  id="formData">
                <div className="form-group">
                    <label htmlFor="front">Front</label>
                    <textarea  onChange={onChangeFront} type="text" className="form-control" id="front" placeholder="Front side of card"></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="back">Back</label>
                    <textarea onChange={onChangeBack} type="text" className="form-control" id="back" placeholder="Back side of card"></textarea>
                </div>
                <button onClick={handleDone} className="btn btn-secondary" style={{marginRight: "0.5rem"}} >Done</button>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
            </form>
        </div>
    )
}

export default AddCard
