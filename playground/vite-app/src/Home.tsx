import { Link } from 'react-router';
import { routes } from './routes';

export function Home() {
  return (
    <div>
      <Nav />
    </div>
  );
}

function Nav() {
  return (
    <ul className="pg-nav">
      {routes.map((entry) => {
        if (entry.type === 'header') {
          return (
            <li key={entry.label} className="pg-nav__header">
              {entry.label}
            </li>
          );
        }

        if (entry.type === 'route' && entry.showInNav) {
          return (
            <li key={entry.path}>
              <Link className="pg-nav__link" to={entry.path}>
                {entry.label}
              </Link>
            </li>
          );
        }

        return null;
      })}
    </ul>
  );
}
