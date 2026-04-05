import { gql } from '@apollo/client';

// ── Auth ───────────────────────────────────────────────────────────────────

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      token
      userId
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      success
      message
    }
  }
`;

// ── User ───────────────────────────────────────────────────────────────────

export const GET_ME = gql`
  query GetMe($userId: ID!) {
    me(userId: $userId) {
      userId
      firstName
      lastName
      email
      mobileNumber
    }
  }
`;

// ── Trips ──────────────────────────────────────────────────────────────────

export const GET_MY_TRIPS = gql`
  query GetMyTrips($userId: ID!) {
    myTrips(userId: $userId) {
      id
      name
      destination
      startDate
      endDate
      createdAt
    }
  }
`;

export const GET_TRIP = gql`
  query GetTrip($tripId: ID!) {
    trip(tripId: $tripId) {
      id
      name
      destination
      startDate
      endDate
      createdAt
      bookings {
        id
        type
        details
        status
        createdAt
      }
    }
  }
`;

export const CREATE_TRIP = gql`
  mutation CreateTrip($input: CreateTripInput!) {
    createTrip(input: $input) {
      id
      name
      destination
      startDate
      endDate
      createdAt
    }
  }
`;

// ── Search ─────────────────────────────────────────────────────────────────

export const SEARCH_TRIPS = gql`
  query SearchTrips($destination: String!, $startDate: String, $endDate: String) {
    searchTrips(destination: $destination, startDate: $startDate, endDate: $endDate) {
      id
      name
      destination
      startDate
      endDate
      createdAt
    }
  }
`;

// ── Bookings ───────────────────────────────────────────────────────────────

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      tripId
      type
      details
      status
      createdAt
    }
  }
`;

export const GET_BOOKINGS_BY_USER = gql`
  query GetBookingsByUser($userId: ID!) {
    bookingsByUser(userId: $userId) {
      id
      tripId
      type
      details
      status
      createdAt
    }
  }
`;
