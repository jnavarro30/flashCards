import React from 'react';

function EditAddForm({ cardInfo, setCardInfo, handleChange, handleDone, handleSave }) {


    return (
        <form  id="formData">
            <div className="form-group">
                <label htmlFor="front">Front</label>
                <textarea  value={cardInfo.front} onChange={handleChange} type="text" className="form-control" id="front" placeholder="Front side of card" name="front"></textarea>
            </div>
            <div className="form-group">
                <label htmlFor="back">Back</label>
                <textarea value={cardInfo.back} onChange={handleChange} type="text" className="form-control" id="back" placeholder="Back side of card" name="back"></textarea>
            </div>
            <button onClick={handleDone} className="btn btn-secondary" style={{marginRight: "0.5rem"}} >Done</button>
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
        </form>
    )
}

export default EditAddForm;
