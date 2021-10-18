function Info({timestamp, commit}) {
    return <section className='info'>
        {timestamp && <h4>Data last updated: {timestamp}</h4>}
        {commit && <h4>
            Commit: <a
            href={`https://dev.azure.com/myorg/websites/_git/websites/commit/${commit}`}
            target='_blank'
            rel='noreferrer'
        >{commit.substr(0, 10)}</a>
        </h4>}
    </section>
}

export default Info;