import { GraphQLScalarType, Kind } from 'graphql';

const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Represents a date value as milliseconds since Unix epoch (1970-01-01T00:00:00Z)',
  serialize(value) {
    if (value instanceof Date) {
      return value.getTime(); // Convert Date object to milliseconds
    }
    throw new Error('DateScalar: Expected a valid Date object');
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return new Date(value); // Convert milliseconds to Date object
    }
    throw new Error('DateScalar: Expected a number representing milliseconds');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Parse integer literal to Date
    }
    throw new Error('DateScalar: Can only parse integer literals');
  },
});

export default DateScalar;
