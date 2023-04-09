function StickyCounts({ moviesResponse }) {

    return (
        <div className="sticky-totals-container">
            { moviesResponse && moviesResponse.Counts && moviesResponse.Counts.map(user => (
                <div class="sticky-totals-user" data-object={"sticky-" + user.Name}>
                    {user.Name}
                    <span>{user.MyCount}</span>
                </div>
            ))}
        </div>

    )
};
export default StickyCounts;


