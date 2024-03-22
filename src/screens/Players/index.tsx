import { useState, useEffect, useRef } from 'react';
import { Alert, FlatList, Keyboard, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

import { Input } from '@components/Input';
import { Header } from '@components/Header';
import { Button } from '@components/Button';
import { Filter } from '@components/Filter';
import { ListEmpty } from '@components/ListEmpty';
import { Highlight } from '@components/Highlight';
import { ButtonIcon } from '@components/ButtonIcon';
import { PlayerCard } from '@components/PlayerCard';

import { Container, Form, HeaderList, NumberOfPlayers } from './styles';
import { AppError } from '@utils/AppError';

import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO'
import { playerGetByGroupAndTeam } from '@storage/player/playerGetByGroupAndTeam';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';

type RouteParams = {
    group: string;
}

export function Players() {
    const [newPlayerName, setNewPlayerName] = useState('')
    const [team, setTeam] = useState('TIME A')
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
    const navigation = useNavigation()

    const route = useRoute()
    const { group } = route.params as RouteParams

    const newPlayerNameInputRef = useRef<TextInput>(null)

    async function handleAddPlayer() {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Nova Pessoa', 'Informe o nome da pessoa para adicionar!')
        }

        const newPlayer = {
            name: newPlayerName,
            team,
        }

        try {
            await playerAddByGroup(newPlayer, group)
            newPlayerNameInputRef.current?.blur()
            setNewPlayerName('')
            fetchPlayerByTeam()
            Keyboard.dismiss()
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message)
            } else {
                Alert.alert('Nova pessoa', 'Não foi possível adicionar!')
                console.log(error)
            }
        }

    }

    async function fetchPlayerByTeam() {
        try {
            const playerByTeam = await playerGetByGroupAndTeam(group, team)
            setPlayers(playerByTeam)
        } catch (error) {
            console.log(error)
            Alert.alert('Pessoas', 'Não foi possivel carregar as pessoas do time selecionado!')
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
            await playerRemoveByGroup(playerName, group)
            fetchPlayerByTeam()
        } catch (error) {
            console.log(error)
            Alert.alert('Remover pessoa', 'Nao foi poeeivel remover a pessoa selecionada!')
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group)
            navigation.navigate('groups')
        } catch (error) {
            console.log(error)
            Alert.alert('Remover', 'Nao foi possivel remover o grupo!')
        }
    }

    async function handleGroupRemove() {
        Alert.alert(
            'Remover',
            'Deseja remover o Grupo?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => groupRemove() }
            ]
        )
    }

    useEffect(() => {
        fetchPlayerByTeam()
    }, [team])

    return (
        <Container>

            <Header showBackButton />

            <Highlight
                title={group}
                subtitle='Adicione a galera e separe os times'
            />

            <Form>

                <Input
                    inputRef={newPlayerNameInputRef}
                    placeholder='Nome do participante'
                    autoCorrect={false}
                    onChangeText={setNewPlayerName}
                    value={newPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType='done'
                />

                <ButtonIcon
                    icon='add'
                    onPress={handleAddPlayer}
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
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <PlayerCard
                        name={item.name}
                        onRemove={() => { handlePlayerRemove(item.name) }}
                    />
                )}

                ListEmptyComponent={() => (
                    <ListEmpty message='Não há participante cadastrado neste time?' />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
            />

            <Button
                title='Remover Turma'
                type='SECONDARY'
                onPress={handleGroupRemove}
            />

        </Container >
    );
}
