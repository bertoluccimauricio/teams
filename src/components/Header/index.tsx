import { useNavigation } from '@react-navigation/native';
import { Container, Logo, BackButton, BackIcon } from './styles';
import logoImg from '@assets/logo.png'

type Props = {
    showBackButton?: boolean
}

export function Header({ showBackButton = false }: Props) {

    const navigation = useNavigation()

    function handleGoBack() {
        navigation.navigate('groups')
        //goback() volta pra tela anteriormente carregada
        //a estratégia acima foi voltar sempre pra Home
    }

    return (
        <Container>
            {
                showBackButton &&
                <BackButton onPress={handleGoBack}>
                    <BackIcon />
                </BackButton>
            }
            <Logo source={logoImg} />
        </Container>
    );
}
