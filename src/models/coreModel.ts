import { useState } from 'react'
export default () => {
  const [user, setUser] = useState({
    name: 'jackson'
  });
  return { user, setUser };
}