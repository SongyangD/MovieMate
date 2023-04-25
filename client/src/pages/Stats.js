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
            <Divider />
            <h2>Top 10 Oscar Directors</h2>
            <DirectorsTable fetchUrl={'top_oscar_director'} />
            <Divider />
            <h2>Ladies, Don't Let Anybody Tell You That You're Past Your Prime!</h2>
            <ActressesTable
                fetchUrl={'oscar_actress'}
                defaultPageSize={5}
                rowsPerPageOptions={[0, 5]} />
            <Divider />
            <h2>Top Oscar Nominated Movies Participations</h2>
            <LazyTable
                route={`http://${config.server_host}:${config.server_port}/stats`}
                columns={decadeColumns}
                defaultPageSize={10}
                rowsPerPageOptions={[0, 10]}
            />
        </Container>
    );
};