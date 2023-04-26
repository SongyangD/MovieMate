import { Container, Divider, Link } from '@mui/material';
import LazyTable from '../components/LazyTable';
import DirectorsTable from '../components/DirectorsCard';
import ActressesTable from '../components/ActressCard';

const config = require('../config.json');

export default function Stats() {

    const decadeColumns = [
        {
            field: 'name',
            headerName: 'Name',
        },
        {
            field: 'num_nominations',
            headerName: 'Nominations',
        },
        {
            field: 'decade',
            headerName: 'Decade'
        },
        {
            field: 'avg_rating',
            headerName: 'Average Movie Ratings'
        },
    ];
    return (
        <Container>
            <div style={{ backgroundImage: `url(https://unsplash.com/photos/OaVJQZ-nFD0/download?force=true&w=1920)`, backgroundSize: 'cover', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{color: 'white', fontSize: '55px', textAlign: 'center', animation: 'dropDown 10s ease-in-out forwards'}}>Hall of Fame</h1>
            </div>
            <Divider />
            <h2>Top 10 Oscar Directors</h2>
            <DirectorsTable fetchUrl={'top_oscar_director'} />
            <Divider />
            <h2>Ladies, Don't Let Anybody Tell You That You're Past Your Prime!</h2>
            <ActressesTable
                fetchUrl={'oscar_actress'}
                defaultPageSize={5}
                rowsPerPageOptions={[5, 10]} />
            <Divider />
            <h2>Top Oscar Nominated Movies Participations</h2>
            <LazyTable
                route={`http://${config.server_host}:${config.server_port}/stats`}
                columns={decadeColumns}
                defaultPageSize={10}
                rowsPerPageOptions={[5, 10]}
            />
        </Container>
    );
};