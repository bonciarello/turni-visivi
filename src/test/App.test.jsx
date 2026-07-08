import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Cartellino')).toBeInTheDocument();
  });

  it('renders the legend with all shift types', () => {
    render(<App />);
    const legendMattina = screen.getAllByText('Mattina');
    expect(legendMattina.length).toBeGreaterThanOrEqual(1);
    const legendPom = screen.getAllByText('Pomeriggio');
    expect(legendPom.length).toBeGreaterThanOrEqual(1);
    const legendNotte = screen.getAllByText('Notte');
    expect(legendNotte.length).toBeGreaterThanOrEqual(1);
    const legendRiposo = screen.getAllByText('Riposo');
    expect(legendRiposo.length).toBeGreaterThanOrEqual(1);
  });

  it('shows the sidebar heading', () => {
    render(<App />);
    expect(screen.getByText('Dipendenti')).toBeInTheDocument();
  });

  it('shows default employees', () => {
    render(<App />);
    const marcoElements = screen.getAllByText('Marco Rossi');
    expect(marcoElements.length).toBeGreaterThanOrEqual(1);
    const lauraElements = screen.getAllByText('Laura Bianchi');
    expect(lauraElements.length).toBeGreaterThanOrEqual(1);
    const ahmedElements = screen.getAllByText('Ahmed Khalil');
    expect(ahmedElements.length).toBeGreaterThanOrEqual(1);
  });

  it('allows adding a new employee', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByLabelText('Nome nuovo dipendente');
    const addBtn = screen.getByLabelText('Aggiungi dipendente');

    await user.type(input, 'Giulia Verdi');
    await user.click(addBtn);

    const giuliaElements = screen.getAllByText('Giulia Verdi');
    expect(giuliaElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows daily summary', () => {
    render(<App />);
    expect(screen.getByText('Copertura giornaliera')).toBeInTheDocument();
  });

  it('shows settings for max per shift', () => {
    render(<App />);
    expect(screen.getByLabelText(/Limite per turno/)).toBeInTheDocument();
  });

  it('renders day headers in the grid', () => {
    render(<App />);
    expect(screen.getByText('Lunedì')).toBeInTheDocument();
    expect(screen.getByText('Domenica')).toBeInTheDocument();
  });

  it('shows the footer', () => {
    render(<App />);
    expect(screen.getByText(/I dati sono salvati solo su questo browser/)).toBeInTheDocument();
  });
});
