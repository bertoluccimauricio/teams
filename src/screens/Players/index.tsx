import { useState } from 'react';
import { FlatList } from 'react-native';

import { Input } from '@components/Input';
import { Header } from '@components/Header';
import { Button } from '@components/Button';
import { Filter } from '@components/Filter';
import { Highlight } from '@components/Highlight';
import { ButtonIcon } from '@components/ButtonIcon';
import { PlayerCard } from '@components/PlayerCard';

import { Container, Form, HeaderList, NumberOfPlayers } from './styles';


export function Players() {

    const [team, setTeam] = useState('TIME A')
    const [players, setPlayers] = useState([])

    return (
        <Container>

            <Header showBackButton />

            <Highlight
                title='Nome da Turma'
                subtitle='Adicione a galera e separe os times'
            />

            <Form>

                <Input
                    placeholder='Nome do participante'
                    autoCorrect={false}
                />

                <ButtonIcon
                    icon='add'
                />

            </Form>

            <HeaderList>

                <FlatList
                    data={['TIME A', 'TIME B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />

                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>


            </HeaderList >

            <FlatList
                data={players}
                keyExtractor={item => item}
                renderItem={(item) => (
                    <PlayerCard
                        name={item}
                    />
                )}
            />

            <Button
                title='Remover Turma'
                type='SECONDARY'
            />

        </Container >
    );
}
