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
      tripId
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
      tripId
      name
      destination
      startDate
      endDate
      createdAt
      bookings {
        bookingId
        tripId
        userId
        status
        createdAt
      }
    }
  }
`;

export const CREATE_TRIP = gql`
  mutation CreateTrip($input: CreateTripInput!) {
    createTrip(input: $input) {
      tripId
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
  query SearchTrips($input: SearchTripsInput!) {
    searchTrips(input: $input) {
      inventories {
        hotelId
        hotelName
        price
        photoUrl
      }
    }
  }
`;

// ── Bookings ───────────────────────────────────────────────────────────────

export const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      bookingId
      tripId
      userId
      status
      createdAt
    }
  }
`;

export const GET_BOOKINGS_BY_USER = gql`
  query GetBookingsByUser($userId: ID!) {
    bookingsByUser(userId: $userId) {
      bookingId
      tripId
      userId
      status
      createdAt
    }
  }
`;
