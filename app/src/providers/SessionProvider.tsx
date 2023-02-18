import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useConfig } from './ConfigProvider';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { UserType } from '../types';
import moment from 'moment';
import { Space, Spin, Typography } from 'antd';
import jwtDecode from 'jwt-decode';
import _ from 'lodash';

type TokensType = {
  refreshToken: string;
  accessToken: string;
  aboutToExpire: number;
};

export type SessionContextType = {
  http: AxiosInstance;
  user?: UserType;

  login(email: string, password: string): Promise<AxiosResponse>;
  logout(): Promise<void>;
};

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined,
);

export function useSession(): SessionContextType {
  const context = useContext(SessionContext);

  if (context === undefined) {
    throw new Error('useSession must be used inside SessionProvider.');
  }

  return context;
}

export function SessionProvider(props: any) {
  const { Provider } = SessionContext;

  const [config] = useConfig();
  const [loading, setLoading] = useState(true);
  const [[tokens, user], setSession] = useState<
    [TokensType | null, UserType | null]
  >([null, null]);

  const defaultHttp = useMemo(
    () =>
      axios.create({
        baseURL: config.baseURL,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    [config],
  );

  const storageTokensKey = 'SessionStorage.tokens';

  function saveTokens(response: AxiosResponse): TokensType {
    const refreshToken = response.headers['x-refresh-token'];
    const accessToken = response.headers['x-access-token'];

    const token = jwtDecode(accessToken) as any;

    const tokens: TokensType = {
      refreshToken,
      aboutToExpire: moment.unix(token.exp).subtract(1, 'minute').unix(),
      accessToken,
    };

    localStorage.setItem(storageTokensKey, JSON.stringify(tokens));
    return tokens;
  }

  function isAccessTokenAboutToExpire(tokens: TokensType): boolean {
    return moment().isAfter(moment.unix(tokens.aboutToExpire));
  }

  const refreshTokenPromiseRef = useRef<Promise<TokensType> | null>(null);

  const refreshTokens = useCallback(
    async (tokens: TokensType): Promise<TokensType> => {
      const response = await defaultHttp.put('/auth', null, {
        headers: {
          'X-REFRESH-TOKEN': tokens.refreshToken,
        },
      });

      return saveTokens(response);
    },
    [defaultHttp],
  );

  const context = useMemo(() => {
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      ...(tokens !== null && {
        'X-ACCESS-TOKEN': tokens.accessToken,
      }),
    };

    const http = axios.create({
      baseURL: config.baseURL,
      headers,
    });

    http.interceptors.request.use(async (config) => {
      let newTokens: TokensType | null = null;

      if (refreshTokenPromiseRef.current !== null) {
        newTokens = await refreshTokenPromiseRef.current;
      } else if (tokens !== null && isAccessTokenAboutToExpire(tokens)) {
        refreshTokenPromiseRef.current = refreshTokens(tokens);
        newTokens = await refreshTokenPromiseRef.current;
        refreshTokenPromiseRef.current = null;
      }

      if (newTokens) {
        _.set(config, 'headers.X-ACCESS-TOKEN', newTokens.accessToken);
        setSession([newTokens, user]);
      }

      return config;
    });

    return {
      http,
      user,

      async login(email: string, password: string) {
        const response = await http.post<UserType>('/auth', {
          email,
          password,
        });

        const tokens = saveTokens(response);
        setSession([tokens, response.data]);
        return response;
      },

      async logout() {
        localStorage.removeItem(storageTokensKey);
        await http.delete('/auth');
        setSession([null, null]);
      },
    };
  }, [config, tokens, user, refreshTokens]);

  const loadSession = useCallback(async () => {
    const tokensJSON = localStorage.getItem(storageTokensKey);

    if (!tokensJSON) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let tokens = JSON.parse(tokensJSON) as TokensType;

      if (isAccessTokenAboutToExpire(tokens)) {
        tokens = await refreshTokens(tokens);
      }

      const userResponse = await defaultHttp.get<UserType>('/users/my', {
        headers: {
          'X-ACCESS-TOKEN': tokens.accessToken,
        },
      });

      setSession([tokens, userResponse.data]);
      setLoading(false);
    } catch (ex) {
      localStorage.removeItem(storageTokensKey);
      setSession([null, null]);
      setLoading(false);
    }
  }, [refreshTokens, defaultHttp]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Space align="center" size={12}>
          <Spin />
          <Typography.Text type="secondary">Loading</Typography.Text>
        </Space>
      </div>
    );
  }

  return <Provider {...props} value={context} />;
}
