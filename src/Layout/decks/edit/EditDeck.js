import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from "react-router-dom";
import { readDeck, updateDeck } from "../../../utils/api/index";

function EditDeck({ renderDecks, setRenderDecks}) {
    const { deckId } = useParams();
    const history = useHistory();
    const [currentDeck, setCurrentDeck] = useState({name: "", description: ""});

    useEffect(() => {
        const abortController = new AbortController();
        const editDeck = async() => {
            const deck = await readDeck(deckId, abortController.signal);
            setCurrentDeck(deck);
        }

        editDeck();
        return () => abortController.abort();
    }, [deckId]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        const abortController = new AbortController();
        await updateDeck(currentDeck, abortController.signal);
        console.log(currentDeck);
        setRenderDecks(!renderDecks);
    }

    const onChangeName = (event) => {
        setCurrentDeck({
            ...currentDeck,
            name: event.target.value
        })
    }

    const onChangeDescription = (event) => {
        setCurrentDeck({
            ...currentDeck,
            description: event.target.value
        })
    }
    
    const handleCancel = () => {
        console.log("cancel handled!");
        history.push(`/decks/${deckId}`);
    }

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" >Home</Link></li>
                    <Link className="breadcrumb-item" to={`/decks/${deckId}`}>{currentDeck.name}</Link>
                    <li className="breadcrumb-item text-secondary" aria-current="page">Edit Deck</li>
                </ol>
            </nav>
            <h2>Edit Deck</h2>
            <form onSubmit={handleSubmit} id="formData">
                <div className="form-group">
                    <label htmlFor="deckName">Name</label>
                    <input onChange={onChangeName} type="text" className="form-control" id="deckName" value={currentDeck.name} /> 
                </div>
                <div className="form-group">
                    <label htmlFor="deckDescription">Description</label>
                    <textarea onChange={onChangeDescription} type="text" className="form-control" id="deckDescription" value={currentDeck.description}></textarea>
                </div>
                <button className="btn btn-secondary" style={{marginRight: "0.5rem"}} onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default EditDeck
