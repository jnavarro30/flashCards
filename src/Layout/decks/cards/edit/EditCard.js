import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from "react-router-dom";
import { updateCard, readDeck, readCard } from "../../../../utils/api/index";

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
            console.log(card)
            setCurrentDeck(deck);
            setCurrentCard(card);
        }

        setDeckAndCard();
        
        return () => abortController.abort();
    }, [cardId, deckId]);

    const handleCancel= () => {
        history.push(`/decks/${deckId}`);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const abortController = new AbortController();
        await updateCard(currentCard, abortController.signal);
        history.push(`/decks/${deckId}`);
    }

    const onChangeFront = (event) => {
        setCurrentCard({
            ...currentCard,
            front: event.target.value
        })
    }

    const onChangeBack = (event) => {
        setCurrentCard({
            ...currentCard,
            back: event.target.value
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
            <form  onSubmit={handleSubmit} id="formData">
                <div className="form-group">
                    <label htmlFor="front">Front</label>
                    <textarea  onChange={onChangeFront} type="text" className="form-control" id="front" value={currentCard.front}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="back">Back</label>
                    <textarea onChange={onChangeBack} type="text" className="form-control" id="back" value={currentCard.back}></textarea>
                </div>
                <button onClick={handleCancel} className="btn btn-secondary" style={{marginRight: "0.5rem"}} >Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default EditCard