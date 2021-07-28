import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom";
import { createDeck, listDecks } from "../../../utils/api/index";

function CreateDeck({ renderDecks, setRenderDecks, currentDeckList, setCurrentDeckList, createdDeckId }) {
    const history = useHistory();
    const [deckInfo, setDeckInfo] = useState({name: "", description: ""});
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, description } = deckInfo;
        if (!name || !description) return;
        setRenderDecks(!renderDecks);
    }

    useEffect(() => {
        setCurrentDeckList([]);
        const abortController = new AbortController();

        const deckCreator = async () => {
            await createDeck(deckInfo, abortController.signal);
            const decks = await listDecks(abortController.signal);
            setCurrentDeckList([...decks]);
            const newId = decks[decks.length - 1].id;
            history.push(`/decks/${newId}`);
        }
    
        if (deckInfo.name && deckInfo.description) {
            deckCreator();
        }

    }, [renderDecks])
    
    const handleCancel = (e) => {
        e.preventDefault();
        setRenderDecks(!renderDecks);
        history.push("/");
    }

    const handleNameChange = (event) => {
        setDeckInfo({
            ...deckInfo,
            name: event.target.value
        })
    }

    const handleDescriptionChange = (event) => {
        setDeckInfo({
            ...deckInfo,
            description: event.target.value
        })
    }

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" >Home</Link></li>
                    <li className="breadcrumb-item text-secondary" aria-current="page">Create Deck</li>
                </ol>
            </nav>
            <h2>Create Deck</h2>
            <form onSubmit={handleSubmit} id="formData">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input onChange={handleNameChange} type="text" className="form-control" id="name" placeholder="Deck Name" value={deckInfo.name} /> 
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea onChange={handleDescriptionChange} type="text" className="form-control" id="description" placeholder="Brief description of deck" value={deckInfo.description}></textarea>
                </div>
                <button className="btn btn-secondary" style={{marginRight: "0.5rem"}} onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default CreateDeck
