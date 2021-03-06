import { Box, Container } from '@chakra-ui/layout';
import {
  Alert,
  AlertIcon,
  Button,
  Divider,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text
} from '@chakra-ui/react';
import { FormEvent, useState } from 'react';
import {
  FiChevronDown as FiChevronDownIcon,
  FiSearch as FiSearchIcon
} from 'react-icons/fi';
import logo from './assets/spacerocket.png';
import { SpaceFlightNewsItem } from './components/space-flight-item';
import { useDebounce } from './hooks/use-debounce';
import { useSpaceFlightNews } from './hooks/use-space-flight-news';
import { getQueryParam, updateQueryParam } from './utils/update-query-params';


const PAGE_LIMIT = 10;

export function App() {
  const [sortParam, setSortParam] = useState('');
  const [limit, setLimit] = useState(PAGE_LIMIT);
  const [searchTerm, setSearchTerm] = useState(getQueryParam('search'));

  const debouncedSearchTerm = useDebounce(searchTerm);

  const { data, isLoading } = useSpaceFlightNews({
    limit,
    sortParam,
    search: debouncedSearchTerm,
  });

  const handleChangeSortParam = async (value: string = '') =>
    setSortParam(value);

  const handleChangeLimit = () => setLimit((old) => old + PAGE_LIMIT);

  const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
    setSearchTerm(e.currentTarget.value);

    updateQueryParam('search', e.currentTarget.value);
  };

  return (
    <>
      <Box as='main'>
        <Box as='section'>
          <Box as='aside' display='flex' justifyContent='space-between'>
            <Box />
            <Box display='flex' marginRight={8} marginTop={4}>
              <Box marginRight={3}>
                <InputGroup>
                  <InputRightElement
                    pointerEvents='none'
                    children={<FiSearchIcon />}
                  />
                  <Input
                    type='search'
                    placeholder='Search'
                    onChange={handleInputChange}
                    value={searchTerm}
                  />
                </InputGroup>
              </Box>
              <Menu>
                <MenuButton as={Button} background='third' rightIcon={<FiChevronDownIcon />}>
                  Sort
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => handleChangeSortParam('publishedAt')}>
                    Mais antigas
                  </MenuItem>
                  <MenuItem onClick={() => handleChangeSortParam('')}>
                    Mais Novas
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Box>
        </Box>
        <Box
          as='aside'
          marginBottom={4}
          display='flex'
          flexDirection='column'
          alignItems='center'>
          <Image
            src={logo}
            alt='SpaceFlightNewsLogo'
            width={110}
            height={110}
          />
          <Text color="third" as='h2' fontSize='3xl' marginTop={4}>
            Space Flight News
          </Text>

          <Box marginTop={4}>{isLoading && <Spinner size='xl' />}</Box>
        </Box>

        <Divider />

        <Container
          marginTop={8}
          as='section'
          maxW='container.lg'
          display='flex'
          alignItems='center'
          flexDirection='column'>
          {data?.map((flight, index) => (
            <Box key={flight.id} marginBottom={6}>
              <SpaceFlightNewsItem
                spaceFlight={flight}
                isInverted={(index + 1) % 2 === 0}
              />
            </Box>
          ))}

          <Box>
            {!data?.length && !isLoading && (
              <Alert status='warning'>
                <AlertIcon />
                N??o h?? voos 
              </Alert>
            )}
          </Box>

          {data?.length ? (
            <Box marginTop={8} marginBottom={8}>
              <Button
                background='third'
                isLoading={isLoading}
                loadingText='Carregando...'
                onClick={handleChangeLimit}>
                Carrega mais
              </Button>
            </Box>
          ) : null}
        </Container>
      </Box>
    </>
  );
}
