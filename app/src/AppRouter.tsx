import React from 'react';
import { Switch, Route } from 'react-router-dom';

export function AppRouter() {
  return (
    <Switch>
      <Route path="/" exact component={() => <div>Hello, World!</div>} />
    </Switch>
  );
}
