
function Counts({moviesResponse}) {
    return (
        <div className="totals-ribbon-box">
            {moviesResponse && moviesResponse.Counts && moviesResponse.Counts.map(nom => (
                <div className="totals-user" data-object="totals-{{this.Name}}">
                    {nom.Name}
                    <span className="movies-count">{nom.MyCount}</span>
                </div>
            ))}
            <div className="total-amount">of<br />{moviesResponse ? moviesResponse.TotalMovies : ''}</div>
        </div>
    )
};


export default Counts;