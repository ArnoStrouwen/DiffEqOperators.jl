struct GhostDerivativeOperator{T<:Real, E<:AbstractDerivativeOperator{T}, F<:AbstractBC{T}} <: AbstractDiffEqLinearOperator{T}
    L :: E
    Q :: F
end

function *(L::AbstractDerivativeOperator{T}, Q::AbstractBC{T}) where{T}
    return GhostDerivativeOperator{T, typeof(L), typeof(Q)}(L,Q)
end

function *(L::AbstractDiffEqCompositeOperator{T}, Q::AbstractBC{T}) where{T}
    return sum(map(op -> op * Q, L.ops))
end

function LinearAlgebra.mul!(x::AbstractVector, A::GhostDerivativeOperator, u::AbstractVector)
    @assert length(u) == A.L.len == length(x)
    LinearAlgebra.mul!(x, A.L, A.Q*u)
end

function *(A::GhostDerivativeOperator{T1}, u::AbstractVector{T2}) where {T1,T2}
    @assert length(u) == A.L.len
    x = zeros(promote_type(T1,T2), A.L.len)
    LinearAlgebra.mul!(x, A, u)
    return x
end

function LinearAlgebra.mul!(M_temp::AbstractMatrix, A::GhostDerivativeOperator, M::AbstractMatrix)
    @assert size(M,1) == size(M_temp,1) == A.L.len
    for i in 1:size(M,2)
        mul!(view(M_temp,:,i), A, view(M,:,i))
    end
end

function *(A::GhostDerivativeOperator{T1}, M::AbstractMatrix{T2}) where {T1,T2}
    @assert size(M,1) == A.L.len
    M_temp = zeros(promote_type(T1,T2), A.L.len, size(M,2))
    LinearAlgebra.mul!(M_temp, A, M)
    return M_temp
end


function LinearAlgebra.ldiv!(x::AbstractVector, A::GhostDerivativeOperator, u::AbstractVector)
    @assert length(x) == A.L.len
    (AL,Ab) = Array(A)
    LinearAlgebra.ldiv!(x, lu!(AL), u-Ab)
end


function \(A::GhostDerivativeOperator{T1}, u::AbstractVector{T2}) where {T1,T2}
    @assert length(u) == A.L.len
    x = zeros(promote_type(T1,T2),size(A,2))
    LinearAlgebra.ldiv!(x, A, u)
    return x
end

function LinearAlgebra.ldiv!(M_temp::AbstractMatrix, A::GhostDerivativeOperator, M::AbstractMatrix)
    @assert size(M_temp) == size(M)
    @assert A.L.len == size(M,1)
    (AL,Ab) = Array(A)
    LinearAlgebra.ldiv!(M_temp, lu!(AL), M .- Ab)
end

function \(A::GhostDerivativeOperator{T1}, M::AbstractMatrix{T2}) where {T1,T2}
    @assert A.L.len == size(M,1)
    M_temp = zeros(promote_type(T1,T2), A.L.len, size(M,2))
    LinearAlgebra.ldiv!(M_temp, A, M)
    return M_temp
end

# # Interface with other GhostDerivativeOperator and with
# # AbstractDiffEqCompositeOperator

# update coefficients
function DiffEqBase.update_coefficients!(A::GhostDerivativeOperator,u,p,t)
    DiffEqBase.update_coefficients!(A.L,u,p,t)
end

# Implement multiplication for coefficients
function *(c::Number, A::GhostDerivativeOperator)
    (c * A.L) * A.Q
end

function *(c::Vector{<:Number}, A::GhostDerivativeOperator)
    (c * A.L) * A.Q
end

function *(coeff_func::Function, A::GhostDerivativeOperator)
    (coeff_func*A.L)*A.Q
end

# length and sizes
Base.ndims(A::GhostDerivativeOperator) = 2
Base.size(A::GhostDerivativeOperator) = (A.L.len, A.L.len)
Base.size(A::GhostDerivativeOperator,i::Integer) = size(A)[i]
Base.length(A::GhostDerivativeOperator) = reduce(*, size(A))


# Concretizations, will be moved to concretizations.jl later
function LinearAlgebra.Array(A::GhostDerivativeOperator,N::Int=A.L.len)
    return (Array(A.L,N)*Array(A.Q,A.L.len)[1], Array(A.L,N)*Array(A.Q,A.L.len)[2])
end

function BandedMatrices.BandedMatrix(A::GhostDerivativeOperator,N::Int=A.L.len)
    return (BandedMatrix(A.L,N)*Array(A.Q,A.L.len)[1], BandedMatrix(A.L,N)*Array(A.Q,A.L.len)[2])
end

function SparseArrays.SparseMatrixCSC(A::GhostDerivativeOperator,N::Int=A.L.len)
    return (SparseMatrixCSC(A.L,N)*SparseMatrixCSC(A.Q,A.L.len)[1], SparseMatrixCSC(A.L,N)*SparseMatrixCSC(A.Q,A.L.len)[2])
end

function SparseArrays.sparse(A::GhostDerivativeOperator,N::Int=A.L.len)
    return SparseMatrixCSC(A,N)
end

@inline ==(A1::GhostDerivativeOperator, A2::GhostDerivativeOperator) = A1.L == A2.L && A1.Q == A2.Q
